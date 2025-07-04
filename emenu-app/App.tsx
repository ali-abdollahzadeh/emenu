import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, ScrollView, I18nManager, Platform } from 'react-native';
import { styled } from 'nativewind';
import './src/styles/global.css';
import { useRef, useEffect, useState } from 'react';
import { categories } from './src/data/categories';
import { foodItems } from './src/data/foodItems';

const Stack = createNativeStackNavigator();

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: View | null }>({});

  const scrollToCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
    const categoryRef = categoryRefs.current[categoryName];
    if (categoryRef && scrollViewRef.current) {
      if (Platform.OS === 'web') {
        // For web platform
        const element = document.getElementById(`category-${categoryName}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // For native platforms
        categoryRef.measureLayout(
          scrollViewRef.current as any,
          (x: number, y: number) => {
            scrollViewRef.current?.scrollTo({ y: y - 80, animated: true });
          },
          () => {}
        );
      }
    }
  };

  // Handle scroll to detect active category
  const handleScroll = (event: any) => {
    if (Platform.OS === 'web') {
      // For web platform
      const scrollPosition = event.nativeEvent.target.scrollTop;
      let currentCategory = null;

      Object.keys(categoryRefs.current).forEach((categoryName) => {
        const element = document.getElementById(`category-${categoryName}`);
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top <= 100 && top >= -100) {
            currentCategory = categoryName;
          }
        }
      });

      if (currentCategory) {
        setActiveCategory(currentCategory);
      }
    } else {
      // For native platforms
      const offsetY = event.nativeEvent.contentOffset.y;
      let currentCategory = null;

      Object.entries(categoryRefs.current).forEach(([name, ref]) => {
        if (ref) {
          ref.measureLayout(
            scrollViewRef.current as any,
            (x: number, y: number) => {
              if (y - 100 <= offsetY && y + 200 > offsetY) {
                currentCategory = name;
              }
            },
            () => {}
          );
        }
      });

      if (currentCategory) {
        setActiveCategory(currentCategory);
      }
    }
  };

  // Proper RTL setup inside component
  useEffect(() => {
    if (Platform.OS !== 'web') {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StyledView className="flex-1 bg-primary min-h-screen" style={{ direction: 'rtl' }}>
        <StatusBar style="light" />
         
        {/* Header */}
        <StyledView className="flex-row items-center justify-between p-4 mt-16">
          <StyledText className="text-white text-2xl font-bold text-right font-yekan">منوی رز کافه</StyledText>
        </StyledView>

        {/* Categories */}
        <StyledView className="px-4">
          <StyledScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ direction: 'rtl' }}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            className="web:overflow-x-auto"
          >
            {categories.map((category) => (
              <StyledTouchableOpacity
                key={category.id}
                className={`h-20 w-20 rounded-lg items-center justify-center mx-1 ${
                  activeCategory === category.name ? 'bg-accent border-2 border-white' : 'bg-secondary'
                }`}
                onPress={() => scrollToCategory(category.name)}
              >
                <StyledText className="text-2xl mb-1">{category.icon}</StyledText>
                <StyledText className="text-white text-xs text-center font-yekan">{category.name}</StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledScrollView>
        </StyledView>

        {/* Content */}
        <StyledScrollView 
          ref={scrollViewRef}
          className="flex-1 mt-6 web:overflow-y-auto"
          showsVerticalScrollIndicator={false}
          style={{ direction: 'rtl'}}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <StyledView className="px-4 text-right">
            {categories.map((category) => {
              const categoryItems = foodItems.filter(item => item.category === category.name);
              if (categoryItems.length === 0) return null;
              
              return (
                <StyledView 
                  key={category.id} 
                  className="mb-6"
                  ref={(ref: View | null) => categoryRefs.current[category.name] = ref}
                  id={`category-${category.name}`}
                >
                  <StyledText className="text-white text-xl font-bold mb-4 text-right font-yekan">{category.name}</StyledText>
                  <StyledView className="space-y-4">
                    {categoryItems.map((item) => (
                      <StyledView
                        key={item.id}
                        className="bg-secondary rounded-lg p-4 web:hover:bg-accent/50 web:cursor-pointer transition-colors duration-200"
                      >
                        <StyledView className="flex-row items-center justify-end">
                        <StyledView className="w-16 h-16 bg-accent rounded-lg ml-4 items-center justify-center overflow-hidden">
                            <StyledImage 
                              source={{ uri: item.imagePath }}
                              className="w-full h-full object-cover"
                              resizeMode="cover"
                            />
                          </StyledView>
                          <StyledView className="flex-1">
                            <StyledText className="text-white text-lg font-bold text-right font-yekan">{item.name}</StyledText>
                            <StyledText className="text-gray-400 mt-1 text-sm text-right font-yekan">{item.description}</StyledText>
                            <StyledText className="text-accent mt-2 text-right font-yekan">{item.price.toLocaleString()} تومان</StyledText>
                          </StyledView>
                        </StyledView>
                      </StyledView>
                    ))}
                  </StyledView>
                </StyledView>
              );
            })}
          </StyledView>
        </StyledScrollView>
      </StyledView>
    </SafeAreaProvider>
  );
}

export default App;
